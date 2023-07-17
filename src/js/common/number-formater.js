const numberFormater = {
  format: (s) => {
    if (s == null) return "";
    return s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },
  getNumber: (s) => {
    if (s == "") return 0;
    return parseInt(s.toString().replace(/\./g, ""));
  },
};

export default numberFormater;
