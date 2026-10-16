export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className='text-slate-900 bg-white min-h-screen'>
      <div className='mx-auto'>
        {children}
      </div>
    </div>
  );
}
