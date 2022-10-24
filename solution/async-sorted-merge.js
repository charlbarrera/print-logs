"use strict";
const { TempList, TempObj } = require('../lib/temp-log-queu');

// Print all entries, across all of the *async* sources, in chronological order.

// to be honest I didn't understand the async exercise, because the dates are 
// being generated synchronously, so the only difference with sync function is that
// here we just need to wait until the promise resolution so practically I just copy/paste 
// the sync function because of that.
module.exports = (logSources, printer) => {
  return new Promise(async(resolve, reject) => {
    const tempList = new TempList(logSources);

    let logsInQueue = true;
    let currentLog = tempList.data.shift();
  
    while (logsInQueue) {
      printer.print(currentLog);    
      const source = currentLog.logSourceNumber;
      const newLog = await logSources[source].popAsync(); // the only difference is here
      if (!newLog) {
        if (!tempList.data.length) {
          logsInQueue = false;
          printer.done();
          break;
        }
        // there is no more logs in this source
        tempList.cleanFromList(source);
        currentLog = tempList.data.shift();
      } else {
        const { date, msg } = newLog;
        const tempObj = new TempObj(date, msg, source);
        currentLog = tempList.calculateNextLog(tempObj);
      }
    }
    resolve(console.log("Async sort complete."));
  });
};
