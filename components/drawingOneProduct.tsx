"use client"

import { useState } from "react";
import DrawingSection from "./single-product-page/drawingSection";
import { Lightbox } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
//@ts-ignore
import 'yet-another-react-lightbox/styles.css'
//@ts-ignore
import 'yet-another-react-lightbox/plugins/thumbnails.css'
//@ts-ignore
import "yet-another-react-lightbox/plugins/captions.css";
import FrequencyResponseSection from "./single-product-page/freqResSection";

export const LightboxOneProduct = ({ name, url, type }: { name: string, url: string, type: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="justify-center pt-8" onClick={() => setOpen(true)}>
        <div className="justify-center cursor-zoom-in p-0">
            {type === "drawing" ?
                <DrawingSection name={name} drawing={url} />
            :
                <FrequencyResponseSection name={name} frequencyres={url}/>
            }
        </div>
        <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={0}
            slides={[{src: url.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${url}` : url, title: name}]}
            plugins={[Zoom, Captions]}
        />
    </div>
  );
};