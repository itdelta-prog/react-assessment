import { useTranslation } from "react-i18next";
import { BlueButton } from "../../AdminPages/Page";
import Select from "react-select";
import { useContext, useEffect, useRef, useState } from "react";
import { CommonContext } from "../../../reducer";
import { router } from "@inertiajs/react";
import axios from "axios";
import download from 'downloadjs';

export default function SelectionFunction({ rows, total, actions }) {
  const { t } = useTranslation(["table", "common", "alert"]);

  const [actionValue, setActionValue] = useState("");
  const { dispatch } = useContext(CommonContext);
  const optionSelected = actions?.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const isOnly = Object.keys(optionSelected).length;

  const handleSubmit = (action) => {
    if (
      Object?.keys(rows)?.length &&
      (Object.keys(actionValue).length > 0 || action.label !== undefined)
    ) {
      const amount = Object.keys(rows).length;
      const value = actionValue?.value ?? action.value;
      const label = actionValue?.label ?? action.label;

      dispatch({
        type: "SHOW_MODAL",
        payload: {
          action: () => {
            const ids = Object?.keys(rows).map(e => `ids[]=${e}`).join('&');
            if (value === "exportToXLS") {
              // запрос файла на скачивание (костыль)
              axios.get(window.location.pathname + `?action=${value}&${ids}`, {}, {
                responseType: 'blob',
                'Cache-Control': 'no-cache',
              })
              .then(response => {
                const content = response.headers['content-type'];
                if (response.headers['content-disposition']) {
                  const fileName = response.headers['content-disposition'].split('filename=')[1] ?? 'tasks.csv';
                  download(response.data, fileName, content)
                }
              })
              .catch(error => console.log(error));
            } else
              // запрос редиректа
              router.get(window.location.pathname + `?action=${value}&${ids}`);
          },
          text: t(`alert:confirmAction`, {
            name: label.toLowerCase(),
            count: amount,
          }),
          type: value === "delete" ? "delete" : "info",
        },
      });
    }
  };

  return (
    <div
      className="flex w-full justify-between gap-3 flex-wrap sm:flex-nowrap"
    >
      <div className="flex gap-3">
        {(() => {
          if (isOnly !== 1) {
            return (
              <>
                <Select
                  className={"min-w-[220px] xxs:text-[12px]"}
                  menuPlacement="top"
                  placeholder={t("table:chooseAction")}
                  options={optionSelected}
                  onChange={(e) => {
                    setActionValue(e);
                  }}
                />
                <BlueButton onClick={handleSubmit} label={t("common:apply")} disabled={!actionValue || !Object.keys(rows)?.length} />
              </>
            );
          } else {
            return (
              <BlueButton
                onClick={() => {
                  handleSubmit(optionSelected[0]);
                }}
                label={t("common:delete")}
                className={
                  "min-w-24"
                }
              />
            );
          }
        })()}
      </div>
      <div className="flex items-center mr-auto">
        {t("table:selected")}: {Object.keys(rows)?.length} {t("common:from")}{" "}
        {total}
      </div>
    </div>
  );
}
