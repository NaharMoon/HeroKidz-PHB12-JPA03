"use client";

import { useState } from "react";
import Image from "next/image";

const ProductGallery = ({ images = [], title }) => {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(gallery[0]);

  return (
    <div className="space-y-4 overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-sm">
      <Image width={700} height={520} src={active || gallery[0]} alt={title} className="h-[420px] w-full rounded-2xl object-cover" />
      <div className="grid grid-cols-4 gap-3">
        {gallery.slice(0,4).map((img) => (
          <button type="button" key={img} onClick={() => setActive(img)} className={`overflow-hidden rounded-2xl border ${active === img ? "border-primary" : "border-base-300"}`}>
            <Image width={160} height={120} src={img} alt={title} className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
