"use client"
import DOMPurify from 'isomorphic-dompurify';

type PropType = {
  content: string
  classname?: string
}

export const Dompurifyclient: React.FC<PropType> = (props) => {
    const { content, classname } = props;
    return (            
        <h3 className={`${classname} tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
                'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
            ],
            ALLOWED_ATTR: [
                'href', 'target', 'rel', 'class', 'id', 'style'
            ],
        }) }}></h3>
    );
}
