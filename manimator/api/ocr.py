import base64
import json
import os
import uuid
from typing import Optional, Dict, Any

import boto3
from fastapi import HTTPException
import litellm

from manimator.utils.system_prompts import OCR_SYSTEM_PROMPT


s3_client = boto3.client("s3")
TEMP_BUCKET = os.getenv("TEMP_S3_BUCKET")


def _upload_temp_file(data: bytes, filename: str) -> None:
    """Upload raw file bytes to temporary S3 location."""
    if not TEMP_BUCKET:
        raise HTTPException(status_code=500, detail="TEMP_S3_BUCKET not configured")
    key = f"temp/{uuid.uuid4().hex}_{filename}"
    s3_client.put_object(Bucket=TEMP_BUCKET, Key=key, Body=data)


def _save_artifact(result: Dict[str, Any]) -> tuple[str, str]:
    """Save OCR result JSON to S3 and return its key and URL."""
    if not TEMP_BUCKET:
        raise HTTPException(status_code=500, detail="TEMP_S3_BUCKET not configured")
    key = f"ocr/{uuid.uuid4().hex}.json"
    s3_client.put_object(
        Bucket=TEMP_BUCKET,
        Key=key,
        Body=json.dumps(result).encode("utf-8"),
        ContentType="application/json",
    )
    url = f"https://{TEMP_BUCKET}.s3.amazonaws.com/{key}"
    return key, url


def _call_vision_model(file_bytes: Optional[bytes], text: Optional[str]) -> Dict[str, Any]:
    messages = [{"role": "system", "content": OCR_SYSTEM_PROMPT}]

    if file_bytes is not None:
        b64 = base64.b64encode(file_bytes).decode("utf-8")
        data_url = f"data:application/pdf;base64,{b64}"
        messages.append(
            {
                "role": "user",
                "content": [{"type": "image_url", "image_url": data_url}],
            }
        )
    elif text is not None:
        messages.append({"role": "user", "content": text})
    else:
        raise HTTPException(status_code=400, detail="No input provided")

    response = litellm.completion(
        model=os.getenv("OCR_MODEL"),
        messages=messages,
        num_retries=2,
    )
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from model: {e}")


def process_ocr(
    file_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    text: Optional[str] = None,
) -> Dict[str, Any]:
    """Process OCR for either file bytes or raw text."""
    if file_bytes is not None and filename:
        _upload_temp_file(file_bytes, filename)

    result = _call_vision_model(file_bytes, text)
    artifact_key, artifact_url = _save_artifact(result)
    return {"artifactId": artifact_key, "artifactUrl": artifact_url, "json": result}

