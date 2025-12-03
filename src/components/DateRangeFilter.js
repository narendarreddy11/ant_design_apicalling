// src/components/DateRangeFilter.jsx
import React from 'react';
import { DatePicker } from 'antd';

const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange }) => {
  const disableEndDate = (current) => {
    if (!current || !startDate) return false;
    return current.isBefore(startDate, 'day');
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <DatePicker
        value={startDate}
        onChange={onStartChange}
        allowClear={false}
        format="YYYY-MM-DD"
        placeholder="Start Date"
      />
      <span>to</span>
      <DatePicker
        value={endDate}
        onChange={onEndChange}
        allowClear={false}
        disabledDate={disableEndDate}
        format="YYYY-MM-DD"
        placeholder="End Date"
      />
    </div>
  );
};

export default DateRangeFilter;
