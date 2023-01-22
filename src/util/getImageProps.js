export const getImageProps = (items) => {
  const isPic = (img) =>
    ['jpg', 'jpeg', 'png'].some((pic) => !!img && img.indexOf(pic) > 0);

  if (!items) return {};

  const imageMap = items.find((f) => isPic(f.url) || isPic(f.href));
  if (imageMap) {
    return {
      image: isPic(imageMap.url) ? imageMap.url : imageMap.href,
      ...imageMap,
    };
  }

  return {};
};
