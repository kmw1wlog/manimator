'use client'

import { useState } from 'react'
import { useStudioStore } from '@/lib/store'

const tabs = ['결과', '프롬프트', '히스토리']

export default function Inspector() {
  const { selectedNode } = useStudioStore()
  const [tab, setTab] = useState('결과')

  if (!selectedNode) {
    return <div className="p-4">노드를 선택하세요</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b">
        {tabs.map((t) => (
          <button
            key={t}
            className={`flex-1 p-2 ${tab === t ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-4 text-sm text-gray-500">데이터 없음</div>
    </div>
  )
}
