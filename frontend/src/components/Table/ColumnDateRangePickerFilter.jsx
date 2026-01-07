import { useEffect, useState } from "react";
import moment from "moment/moment";
import { ButtonGroup, Button } from "@nextui-org/button";
import { XIcon } from "@heroicons/react/solid";
import { DateRangePicker } from "@nextui-org/date-picker";
import {
  today,
  startOfMonth,
  endOfMonth,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";

export default function ColumnDateRangePickerFilter({ column }) {
  const { setFilter } = column;
  const { filterValue } = column;
  const filteredParse = JSON.parse(filterValue ?? "[null, null]");

  const data = {
    start: filteredParse[0] ? parseDate(filteredParse[0]) : null,
    end: filteredParse[1] ? parseDate(filteredParse[1]) : null,
  };

  const [focusedValue, setFocusedValue] = useState(data?.start);

  let now = today(getLocalTimeZone());
  let yesterday = now.subtract({ days: 1 });

  const lastMoth = {
    start: startOfMonth(now.subtract({ months: 1 })),
    end: endOfMonth(now.subtract({ months: 1 })),
  };

  const setDataFilter = (date) => {
    if (date !== "") {
      const dateFilter = [
        moment(date.start?.toDate()).format("YYYY-MM-DD"),
        moment(date.end?.toDate()).format("YYYY-MM-DD"),
      ];
      setFilter(JSON.stringify(dateFilter));
    } else {
      setFilter("");
    }
  };

  const handleChange = (val) => {
    localStorage.setItem(
      "filters_" + window.location.pathname,
      JSON.stringify({
        start: val.start?.toDate(getLocalTimeZone()) ?? null,
        end: val.end?.toDate(getLocalTimeZone()) ?? null,
      })
    );

    val ? setDataFilter(val) : setDataFilter("");
  };

  const stylesDatePicker = {
    base: ["bg-white", "rounded-lg"],
    input: [
      "rounded-lg",
      "transition-colors", // плавный переход
    ],
    selectorButton: ["text-primary"],
    inputWrapper: [
      "border-none", // задает стиль границы
      "border-gray-300", // начальная граница обертки
      "rounded-lg",
      "transition-colors", // анимация перехода цвета
      "focus-within:ring-1", // добавление внешнего кольца при фокусе
      "focus-within:ring-indigo-500", // цвет кольца
    ],
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <div className="rounded-lg w-full border-1 border-gray-300">
        <DateRangePicker
          label=""
          CalendarTopContent={
            <ButtonGroup
              fullWidth
              className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
              radius="full"
              size="sm"
              variant="bordered"
            >
              <Button
                onPress={() => {
                  setFocusedValue(startOfMonth(now));
                  handleChange({
                    start: startOfMonth(now),
                    end: endOfMonth(now),
                  });
                }}
              >
                Текущий месяц
              </Button>
              <Button
                onPress={() => {
                  setFocusedValue(lastMoth.start);
                  handleChange(lastMoth);
                }}
              >
                Прошлый месяц
              </Button>
            </ButtonGroup>
          }
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
                  setFocusedValue(now);
                  handleChange({ start: now, end: now });
                }}
              >
                Сегодня
              </Button>

              <Button
                onPress={() => {
                  setFocusedValue(yesterday);
                  handleChange({ start: yesterday, end: yesterday });
                }}
              >
                Вчера
              </Button>

              <Button
                onPress={() => {
                  setFocusedValue(now);
                  handleChange({
                    start: now.subtract({ days: 7 }),
                    end: now,
                  });
                }}
              >
                7 дней
              </Button>
            </ButtonGroup>
          }
          calendarProps={{
            focusedValue: focusedValue,
            onFocusChange: (val) => {
              setFocusedValue(val);
            },
            nextButtonProps: {
              variant: "bordered",
            },
            prevButtonProps: {
              variant: "bordered",
            },
          }}
          visibleMonths={2}
          value={data}
          onChange={(val) => {
            handleChange(val);
          }}
          granularity="day"
          variant="bordered"
          classNames={stylesDatePicker}
          errorMessage={({
            validationDetails: { rangeOverflow, rangeUnderflow },
          }) =>
            rangeOverflow || rangeUnderflow
              ? "Дата начала должна быть раньше даты окончания"
              : ""
          }
        />
      </div>
      <button
        className="w-4 h-4 transition-all bg-indigo-100 rounded-full lg:-translate-x-16 duration-300 ease-in-out opacity-70"
        onClick={() => {
          setFilter("");
        }}
      >
        <XIcon className="cursor-pointer w-4 h-4 text-indigo-600" />
      </button>
    </div>
  );
}
