import clsx from "clsx";

export function Avatar({
  className,
  alt,
  src,
  ...props
}: {
  className?: string;
  alt?: string;
  src: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={alt ?? "Avatar"}
      className={clsx(
        "size-7 shrink-0 rounded-full border-2 border-white object-cover dark:border-gray-800",
        className,
      )}
      height={28}
      src={src || "/placeholder.svg"}
      width={28}
      {...props}
    />
  );
}