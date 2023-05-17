class QueryNBodyItemInfo{
    constructor(isWhat, type, valueSpectrum, inputPin, defaultValue){
        this.isWhat = isWhat;
        this.type = type;
        this.valueSpectrum = valueSpectrum;
        this.inputPin = inputPin;
        this.defaultValue = defaultValue;
    }
}

class QueryNBodyItem{
    constructor(name, info, isRequired){
        this.name = name;
        this.info = info,
        this.isRequired = isRequired;
    }
}

class TitleItem{
    constructor(protocol, url, actionName, info, unique){
        this.protocol = protocol;
        this.url = url;
        this.actionName = actionName;
        this.info = info;
        this.unique = unique;
    }
}

class ActionItem{
    constructor(titleItem){
        this.titleInfo = titleItem;
        this.queryInfo = [];
        this.bodyInfo = [];
        this.resultFilter = [];
    }

    unshiftQueryItem(queryItem){
        this.queryInfo.unshift(queryItem);

        return this;
    }

    unshiftBodyItem(bodyItem){
        this.bodyInfo.unshift(bodyItem);

        return this;
    }

    pushQueryItem(queryItem){
        this.queryInfo.push(queryItem);

        return this;
    }

    pushBodyItem(bodyItem){
        this.bodyInfo.push(bodyItem);

        return this;
    }

    pushFilter(callback){
        this.resultFilter.push(callback);

        return this;
    }
}

class UrlForm {
    constructor(url, unique){
        this.mainTitle = {};
        this.action = [];

        this.mainTitle.url = url;
        this.mainTitle.unique = unique;
    }

    unshiftQueryItem(queryItem, index){
        index = parseInt(index);
        if(Number.isInteger(index) && (this.action.length > index && index >= 0)){
            this.action[index].queryInfo.unshift(queryItem);
        }
        else{
            this.action[this.action.length-1].queryInfo.unshift(queryItem);
        }

        return this;
    }

    unshiftBodyItem(bodyItem, index){
        index = parseInt(index);
        if(Number.isInteger(index) && (this.action.length > index && index >= 0)){
            this.action[index].bodyInfo.unshift(bodyItem);
        }
        else{
            this.action[this.action.length-1].bodyInfo.unshift(queryItem);
        }
        

        return this;
    }

    pushQueryItem(queryItem, index){
        index = parseInt(index);
        if(Number.isInteger(index) && (this.action.length > index && index >= 0)){
            this.action[index].queryInfo.push(queryItem);
        }
        else{
            this.action[this.action.length-1].queryInfo.push(queryItem);
        }

        return this;
    }

    pushBodyItem(bodyItem, index){
        index = parseInt(index);
        
        if(Number.isInteger(index) && (this.action.length > index && index >= 0)){
            this.action[index].bodyInfo.push(bodyItem);
        }
        else{
            this.action[this.action.length-1].bodyInfo.push(bodyItem);
            
        }

        return this;
    }

    pushFilter(callback, index){
        index = parseInt(index);

        if(Number.isInteger(index) && (this.action.length > index && index >= 0)){
            this.action[index].resultFilter.push(callback);
        }
        else{
            this.action[this.action.length-1].resultFilter.push(callback);
        }

        return this;
    }

    /**
     * @param { ActionItem } actionItem
     */
    addAction(actionItem){
        this.action.push(actionItem);

        return this;
    }
}

module.exports = {
    QueryNBodyItemInfo, QueryNBodyItem, TitleItem, ActionItem, UrlForm
};