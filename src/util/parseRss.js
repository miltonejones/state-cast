import { createListMap } from '.';

const recurse = (elements, out = [], level = 0) => {
  !!elements &&
    elements.map((element, e) => {
      const cdata = element.elements?.find((e) => e.type === 'cdata');
      const text = element.elements?.find((e) => e.type === 'text');
      if (text) {
        out.push({
          [element.name]: text.text,
          ...element.attributes,
          level,
        });
      } else if (cdata) {
        out.push({
          [element.name]: cdata.cdata,
          ...element.attributes,
          level,
        });
      } else {
        out.push({
          ...element.attributes,
          level,
        });
        recurse(element.elements, out, ++level);
      }

      return out;
    });

  return out;
};

export const parseRss = (elements) => {
  const nodes = recurse(elements);
  return createListMap(nodes);
};
