import React, { useState } from "react";

const MemoImage = React.memo((props: { preview: string }) => {
  const { preview } = props;
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={preview}
      alt={`Uploaded image ${preview}`}
      loading="lazy"
    //   loading="eager"
    onLoad={() => setLoaded(true)}
      className={`
        w-full h-48 object-cover rounded-lg shadow-md transform transition-all duration-200 
        scale-95 hover:scale-100 hover:z-10 
        ${loaded ? 'opacity-100' : 'opacity-10'}
      `}
      style={{ transformOrigin: "center" }}
    />
  );
});

export default MemoImage;
