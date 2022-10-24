

class LogEntry {
    date;
    msg;
    constructor(date, msg) {
      this.date = date;
      this.msg = msg;
    }
  }
  
class TempObj extends LogEntry {
    logSourceNumber;
    constructor(date, msg, source) {
      super(date, msg);
      this.logSourceNumber = source;
    }
  }

class TempList {
    // this list is a pivot that stores the logs next to be printed
    // in other words, it will store max 1 log per source in a sorted manner
    data = [];

    constructor(logSources) {
        this.init(logSources);
    }

    init(logSources) {
        for (let i = 0; i <= logSources.length - 1; i++) {
          const logSource = logSources[i];
          const recentEntry = logSource.pop();
          const tempObj = new TempObj(recentEntry.date, recentEntry.msg, i);
          this.data.push(tempObj); 
        }
        if (this.data.length > 1) {
          this.data.sort((a, b) => a.date - b.date);
        }
    }

    cleanFromList(sourceNumber) {
        this.data.splice(sourceNumber, 1);
    }

    calculateNextLog(item) {
        if (!this.data.length) return item;

        // data is sorted 
        if (item.date <= this.data[0].date) {
            return item;
        }
        let nextLog = this.data.shift();

        // add item in the sorted list
        const index = binarySearch(this.data, item);
        this.data.splice(index, 0, item);
        return nextLog;
   }

}

function binarySearch(array, targetValue) {
  var min = 0;
  var max = array.length - 1;
  var guess;

  if (targetValue.date < array[0].date) {
    return 0;
  }

  if (targetValue.date > array[array.length - 1].date) {
    return array.length;
  }

  while (min <= max) {
    guess = Math.floor((max + min) / 2);

    if (array[guess].date === targetValue.date) {
      return guess;
    }

      if (array[guess].date < targetValue.date && targetValue.date < array[guess + 1].date) {
      return guess + 1;
    } else if (array[guess].date < targetValue.date) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }

  return array.length;
}


module.exports = {
    TempObj,
    TempList
}