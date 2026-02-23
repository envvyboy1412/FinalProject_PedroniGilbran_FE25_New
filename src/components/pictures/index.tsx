type PictureProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function Picture({
  src,
  alt = "image",
  className = "",
}: PictureProps) {
  return (
    <img
      src={src || "/images/default-pic.jpg"}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/images/default-pic.jpg";
      }}
      className={className}
    />
  );
}