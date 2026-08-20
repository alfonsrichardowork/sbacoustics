"use client"

import { useState } from "react";
import { Lightbox } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
//@ts-ignore
import 'yet-another-react-lightbox/styles.css'
//@ts-ignore
import 'yet-another-react-lightbox/plugins/thumbnails.css'
//@ts-ignore
import "yet-another-react-lightbox/plugins/captions.css";
import DrawingSectionOld from "./drawingSection";
import FrequencyResponseSectionOld from "./freqResSection";

export const LightboxOneProductOld = ({ name, url, type }: { name: string, url: string, type: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
        justifyContent: "center",
        paddingTop: '32px'
    }} onClick={() => setOpen(true)}>
        <div style={{
            justifyContent: 'center',
            cursor: 'zoom-in',
            padding: '0px'
        }}>
            {type === "drawing" ?
                <DrawingSectionOld name={name} drawing={url} />
            :
                <FrequencyResponseSectionOld name={name} frequencyres={url}/>
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