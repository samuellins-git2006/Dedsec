import BottomNav from '../../components/BottomNav';

export default function TabsLayout({ children }) {
  return (
    <div className="bg-[#050a0f] min-h-screen flex justify-center">
      {/* Moldura vertical de smartphone centralizada no PC */}
      <div className="w-full max-w-md min-h-screen border-x border-dedsec-blue/30 relative pb-24 bg-[#050a0f] shadow-[0_0_30px_rgba(0,191,255,0.15)] overflow-x-hidden">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}