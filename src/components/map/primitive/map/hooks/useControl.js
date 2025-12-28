export default function (map) {
  let innerControls = [];

  const getControl = (ctrlName) => {
    let ctrlItem = innerControls.find((n) => n.ctrlName == ctrlName);
    return ctrlItem ? ctrlItem.control : null;
  };

  const addControl = (ctrlName, control) => {
    if (!ctrlName || typeof ctrlName != "string") {
      throw new Error("ctrlName is required");
    }
    assertNewControl(ctrlName);
    innerControls.push({ ctrlName, control });
    map.addControl(control.ol);
  };

  const assertNewControl = (ctrlName) => {
    if (innerControls.find((n) => n.ctrlName == ctrlName)) {
      throw new Error("Duplicate control");
    }
  };

  const removeControl = (ctrlName) => {
    if (innerControls.find((n) => n.ctrlName == ctrlName)) {
      map.removeControl(
        innerControls.find((n) => n.ctrlName == ctrlName).control.ol
      );
      innerControls = innerControls.filter((n) => n.ctrlName != ctrlName);
    }
  };

  const removeAll = () => {
    innerControls.forEach(ctl => {
      map.removeControl(ctl.ol);
    })
    innerControls = [];
  }

  return {
    innerControls,
    getControl,
    addControl,
    removeControl,
    removeAll
  };
}
