import Toast from 'react-native-root-toast';

type DateAndDaysAgo = {
  formattedDate: string;
  daysAgo: string;
};

export function formatDateAndDaysAgo(dateString: string): DateAndDaysAgo {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const formattedDate = inputDate.toISOString().split('T')[0];

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const daysDifference = Math.floor(
    (currentDate.getTime() - inputDate.getTime()) / oneDayInMilliseconds,
  );

  let daysAgo = '';
  if (daysDifference === 0) {
    daysAgo = 'Today';
  } else if (daysDifference === 1) {
    daysAgo = '1 day ago';
  } else {
    daysAgo = `${daysDifference} days ago`;
  }

  return {
    formattedDate,
    daysAgo,
  };
}

export function formatBytes(bytes: number): string {
  const B = 1;
  const KB = B * 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  let value: number;
  let unit: string;

  if (bytes >= GB) {
    value = bytes / GB;
    unit = 'GB';
  } else if (bytes >= MB) {
    value = bytes / MB;
    unit = 'MB';
  } else if (bytes >= KB) {
    value = bytes / KB;
    unit = 'KB';
  } else {
    value = bytes;
    unit = 'B';
  }

  return `${value.toFixed(2)} ${unit}`;
}

export function showToast(message: string) {
  Toast.show(message, {
    position: Toast.positions.TOP + 35,
    duration: Toast.durations.SHORT,
  });
}
