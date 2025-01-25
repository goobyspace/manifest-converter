function TabsContainer({
  tabs,
  selected,
  onChange,
}: {
  tabs: string[];
  selected: number;
  onChange: (tab: number) => void;
}) {
  return (
    <div className="tabs-container">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={tab === tabs[selected] ? "tab selected" : "tab"}
          onClick={() => onChange(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export default TabsContainer;
