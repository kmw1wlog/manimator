export const useRightPanel = () => {
  const switchTab = (tab: string) => {
    console.log(`Switching right panel to ${tab}`);
  };
  return { switchTab };
};

export default useRightPanel;
