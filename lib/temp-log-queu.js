

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
        this.data.push(item);

        // sort internally use insertion sort algorithm
        // so in the worst case O(n2) and the best case(n)
        this.data.sort((a, b) => a.date - b.date);
        return nextLog;
   }

}

module.exports = {
    TempObj,
    TempList
}