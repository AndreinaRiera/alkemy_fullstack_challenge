
String.prototype.ToCapitalize = function (config = {}) {
    let defaultConfig = {
      mode: "first",
      rest: "lowercase"
    };
  
    if (typeof config === 'object') {
      for (const key in defaultConfig) {
        if(config.hasOwnProperty(key)){
          defaultConfig[key] = config[key];
        }
      }
    } else if(config) {
        defaultConfig.mode = config;
    }
  
    let str = this;
  
    if (defaultConfig.rest === "lowercase") {
      str = str.toLowerCase();
    }
  
    var separateWord = (defaultConfig.mode == "all") ? str.split(' ') : [str];
  
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
        separateWord[i].substring(1);
    }
  
    return separateWord.join(' ');
  };
