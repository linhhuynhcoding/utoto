
export default function PromoSection() {
    const promos = [
        "https://n1-cstg.mioto.vn/g/2026/00/05/15/JP4LHZI3.jpg",
        "https://n1-cstg.mioto.vn/g/2026/00/01/00/2CBU6G2N.jpg",
        "https://n1-cstg.mioto.vn/g/2025/11/18/17/22USABLN.jpg",
        "https://n1-cstg.mioto.vn/g/2026/00/05/09/EJRC3YEC.jpg",
    ]

    return (
        <div className="py-16 bg-secondary/30">
            <div className="container">
                <h2 className="text-3xl font-bold mb-2">Chương Trình Khuyến Mãi</h2>
                <h5 className="text-muted-foreground mb-8">Nhận nhiều ưu đãi hấp dẫn từ Utoto</h5>

                <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
                    {promos.map((src, i) => (
                        <div key={i} className="min-w-[300px] md:min-w-[400px] snap-center">
                            <img src={src} alt="Promo" className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow" />
                        </div>
                    ))}
                    {promos.map((src, i) => (
                        <div key={`d-${i}`} className="min-w-[300px] md:min-w-[400px] snap-center">
                            <img src={src} alt="Promo" className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
