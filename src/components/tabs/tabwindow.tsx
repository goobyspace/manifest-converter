function TabWindow({
  tab,
  selected,
  children,
}: {
  tab: number;
  selected: number;
  children: React.ReactNode;
}) {
  return (
    <div className={tab === selected ? "tab-window" : "hidden"}>
      {tab === selected && children}
    </div>
  );
}

export default TabWindow;
