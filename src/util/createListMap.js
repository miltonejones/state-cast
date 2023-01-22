export const createListMap = (elementList) =>
  Array.from(new Set(elementList.map((f) => f.level))).reduce((out, res) => {
    const items = elementList.filter((f) => f.level === res);
    const node = items.reduce((item, row) => {
      Object.keys(row).map((m, i) => {
        item[m] = Object.values(row)[i];
        return item;
      });
      return item;
    }, {});
    return out.concat(node);
  }, []);
