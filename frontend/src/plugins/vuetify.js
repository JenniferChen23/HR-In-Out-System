// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          "data-table-header": "#808080", 
        },
      },
    },
  },
});
