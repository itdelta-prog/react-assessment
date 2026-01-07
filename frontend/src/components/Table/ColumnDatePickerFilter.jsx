import { DatePicker } from "@nextui-org/date-picker";
import { useState } from "react";
import moment from "moment/moment";
import { ButtonGroup, Button } from "@nextui-org/button";
import {
  today,
  startOfMonth,
  endOfMonth,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  toCalendarDate,
} from "@internationalized/date";

export default function ColumnDatePickerFilter({ column }) {
  const { setFilter } = column || {};

  const setDataFilter = (date) => {
    const dateFilter = moment(date.toDate()).format("YYYY-MM-DD");
    setFilter(JSON.stringify(dateFilter));
  };

  const localStorageDate =
    JSON.parse(
      localStorage.getItem("dateFilterPicker_" + window.location.pathname)
    )?.date ?? null;
  const data = localStorageDate
    ? toCalendarDate(parseAbsoluteToLocal(localStorageDate))
    : toCalendarDate(today(getLocalTimeZone()));

  const [value, setValue] = useState(data);

  let now = toCalendarDate(today(getLocalTimeZone()));
  let yesterday = now.subtract({ days: 1 });

  const handleChange = (val) => {
    setValue(val);

    localStorage.setItem(
      "dateFilterPicker_" + window.location.pathname,
      JSON.stringify({
        date: val.toDate(getLocalTimeZone()),
      })
    );
    val ? setDataFilter(val) : setDataFilter("");
  };

  return (
    <div
    // className="bg-white rounded-md"
    >
    <DatePicker
      value={value}
      visibleMonths={2}
      CalendarBottomContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() => {
              setValue(now);
            }}
          >
            Сегодня
          </Button>

          <Button
            onPress={() => {
              setValue(yesterday);
            }}
          >
            Вчера
          </Button>
        </ButtonGroup>
      }
      onChange={(e) => handleChange(e)}
      variant="bordered"
      color="primary"
      className="max-w-xs c bg-white rounded-medium"
      aria-label="Выберите дату"
      showMonthAndYearPickers={1}
    />
  </div>
  );
}
