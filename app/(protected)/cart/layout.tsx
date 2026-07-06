import Navbar from "@/app/(components)/navbar";

export default function CartLayout({children}: {children: React.ReactNode}){
    return (
        <div className="min-h-screen h-full bg-white">
          <Navbar />
            {children}
        </div>
    )
}
    