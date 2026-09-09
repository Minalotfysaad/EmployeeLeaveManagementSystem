import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { holidaysApi } from '../../api/holidays.api';
import { UPCOMING_TEAM_LEAVE } from '../../api/mock/mockData';
import { formatDateShort } from '../../utils/date';

export const CalendarPage: React.FC = () => {
  // Calendar month state: defaulting to October 2026 to match mock data
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026 (0-indexed 9)

  const { data: holidaysData } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => holidaysApi.getHolidays(),
  });

  const holidays = holidaysData?.items || [];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 1));
  };

  // Sample schedule items for October 2026 matching mockup
  const monthLeaves = [
    { day: 10, employee: 'David Chen', type: 'Vacation', color: 'bg-brand-lightTeal text-brand-darkTeal border-brand-teal/30' },
    { day: 11, employee: 'David Chen', type: 'Vacation', color: 'bg-brand-lightTeal text-brand-darkTeal border-brand-teal/30' },
    { day: 12, employee: 'Sarah Kim', type: 'Personal', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { day: 12, employee: 'David Chen', type: 'Vacation', color: 'bg-brand-lightTeal text-brand-darkTeal border-brand-teal/30' },
    { day: 13, employee: 'Annan Fiala', type: 'Vacation', color: 'bg-brand-lightTeal text-brand-darkTeal border-brand-teal/30' },
    { day: 14, employee: 'David Chen', type: 'Vacation', color: 'bg-brand-lightTeal text-brand-darkTeal border-brand-teal/30' },
    { day: 15, employee: 'Leila Vance', type: 'Vacation', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { day: 16, employee: 'Leila Vance', type: 'Vacation', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { day: 17, employee: 'Ciney Monn', type: 'Personal', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { day: 18, employee: 'Leila Vance', type: 'Vacation', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Team Availability Calendar"
        subtitle="Visual timeline of employee vacations, scheduled leaves, and organization holidays."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            {/* Calendar Controls Header */}
            <div className="p-4 sm:p-5 border-b border-[#E5EAF0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-lightTeal text-brand-teal flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-sans">
                  {monthNames[month]} {year}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <Button size="xs" variant="outline" onClick={handleToday}>
                  Current
                </Button>
                <Button size="xs" variant="outline" onClick={handlePrevMonth} title="Previous month">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="xs" variant="outline" onClick={handleNextMonth} title="Next month">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-[#E5EAF0] bg-gray-50 text-center py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-[#E5EAF0] bg-white">
              {/* Prev month fill days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => {
                const prevDay = daysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <div key={`prev-${i}`} className="min-h-[90px] p-2 bg-gray-50/50 text-gray-400 text-xs">
                    <span>{prevDay}</span>
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const events = month === 9 ? monthLeaves.filter((e) => e.day === dayNum) : [];

                return (
                  <div
                    key={`day-${dayNum}`}
                    className="min-h-[90px] p-2 hover:bg-gray-50/70 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          dayNum === 15 && month === 9 ? 'bg-brand-teal text-white' : 'text-gray-700'
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {/* Events list inside cell */}
                    <div className="space-y-1 mt-1">
                      {events.slice(0, 2).map((ev, idx) => (
                        <div
                          key={idx}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${ev.color}`}
                          title={`${ev.employee} (${ev.type})`}
                        >
                          {ev.employee.split(' ')[0]}: {ev.type}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <span className="text-[9px] text-gray-400 font-bold block">
                          +{events.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Upcoming Team Absences & Holidays (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Leaves */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Team Absences in {monthNames[month]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {UPCOMING_TEAM_LEAVE.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.name} src={item.avatar} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-navy-900">{item.name}</p>
                      <span className="text-[11px] text-gray-500">{item.type}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-darkTeal bg-brand-lightTeal px-2 py-0.5 rounded-md">
                    {item.dates}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Public Holidays */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Public Holidays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-4 text-xs">
              {holidays.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <span className="font-semibold text-gray-800">{h.name}</span>
                  <span className="text-gray-500 font-medium">{formatDateShort(h.startDate)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
