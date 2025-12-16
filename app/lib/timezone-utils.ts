/**
 * Timezone utility functions
 * Handles timezone conversion for scheduling
 */

/**
 * Get user's timezone from account settings or default to browser timezone
 */
export function getUserTimezone(): string {
  // Try to get from localStorage (set in account settings)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('postvolve_user_timezone');
    if (stored) return stored;
    
    // Fallback to browser timezone
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  // Server-side default
  return 'America/New_York';
}

/**
 * Convert a local date/time string to UTC ISO string
 * @param dateString - Date in YYYY-MM-DD format
 * @param timeString - Time in HH:MM format (24-hour)
 * @param timezone - User's timezone (e.g., 'America/New_York')
 * @returns ISO string in UTC
 */
export function convertToUTC(
  dateString: string,
  timeString: string,
  timezone: string = getUserTimezone()
): string {
  try {
    // Create date string in user's timezone
    // Format: YYYY-MM-DDTHH:MM:SS (local time)
    const localDateTime = `${dateString}T${timeString}:00`;
    
    // Create a date object - this will be interpreted in the user's timezone
    // We need to manually convert to UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create date in user's timezone
    // Use Intl.DateTimeFormat to handle timezone conversion
    const dateInTimezone = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, 0)
    );
    
    // Get the offset for the user's timezone at this date
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    // Parse the formatted string to get the actual local time
    const parts = formatter.formatToParts(dateInTimezone);
    const localYear = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const localMonth = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    const localDay = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const localHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const localMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    
    // Create a date object representing the local time
    const localDate = new Date(localYear, localMonth - 1, localDay, localHour, localMinute);
    
    // Get UTC equivalent
    const utcDate = new Date(
      localDate.getTime() - (localDate.getTimezoneOffset() * 60000)
    );
    
    // Better approach: Use a library-like conversion
    // For now, use a simpler method that works for most cases
    const dateObj = new Date(`${dateString}T${timeString}:00`);
    
    // Get timezone offset in minutes
    const tzOffset = getTimezoneOffset(timezone, dateObj);
    
    // Adjust for timezone offset
    const utcTime = dateObj.getTime() - (tzOffset * 60000);
    const utcDateObj = new Date(utcTime);
    
    return utcDateObj.toISOString();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    // Fallback: assume local timezone
    return new Date(`${dateString}T${timeString}:00`).toISOString();
  }
}

/**
 * Get timezone offset in minutes for a given timezone and date
 */
function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    // Create two formatters: one for UTC, one for the timezone
    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    // Format the same date in both timezones
    const utcTime = utcFormatter.format(date);
    const tzTime = tzFormatter.format(date);
    
    // Parse times and calculate difference
    const [utcHours, utcMinutes] = utcTime.split(':').map(Number);
    const [tzHours, tzMinutes] = tzTime.split(':').map(Number);
    
    const utcTotalMinutes = utcHours * 60 + utcMinutes;
    const tzTotalMinutes = tzHours * 60 + tzMinutes;
    
    return tzTotalMinutes - utcTotalMinutes;
  } catch (error) {
    console.error('Error calculating timezone offset:', error);
    return 0;
  }
}

/**
 * Convert UTC ISO string to user's local timezone
 * @param utcISOString - ISO string in UTC
 * @param timezone - User's timezone
 * @returns Object with date and time strings
 */
export function convertFromUTC(
  utcISOString: string,
  timezone: string = getUserTimezone()
): { date: string; time: string } {
  try {
    const date = new Date(utcISOString);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const hour = parts.find(p => p.type === 'hour')?.value || '';
    const minute = parts.find(p => p.type === 'minute')?.value || '';
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
    };
  } catch (error) {
    console.error('Error converting from UTC:', error);
    // Fallback
    const date = new Date(utcISOString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  }
}

/**
 * Format scheduled time for display in user's timezone
 */
export function formatScheduledTime(
  utcISOString: string,
  timezone: string = getUserTimezone()
): string {
  try {
    const date = new Date(utcISOString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting scheduled time:', error);
    return new Date(utcISOString).toLocaleString();
  }
}

