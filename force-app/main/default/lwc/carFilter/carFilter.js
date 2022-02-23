import { LightningElement,wire } from 'lwc';
import { getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';

import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/car__c.Make__c'

//LMS Import(same for subscriber and publisher just publish becomes subscribe)
import {publish, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c'

//Constants
const CATEGORY_ERROR = 'Error Loading Categories'
const MAKE_ERROR = 'Error Loading Make Types'

export default class CarFilter extends LightningElement {
    categotyError = CATEGORY_ERROR
    makeError = MAKE_ERROR
    filters={
        searchKey:'',
        maxPrice:999999
    }
    timer

    /**Load Context For LMS */
    @wire(MessageContext)
    messageContext

    /**Publish the data*/
    sendDataToCarList(){                                               //deBouncing
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CARS_FILTERED_MESSAGE, {
                filters:this.filters
            })
        }, 400)
    }


    //Fetching Category Picklist Values
    @wire(getObjectInfo,{objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues, {
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD
    })categories

    @wire(getPicklistValues, {
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: MAKE_FIELD
    })makeType

    /**** Search Key Handler */
    handleSearchKeyChange(event){
        this.filters ={...this.filters, "searchKey":event.target.value}
        this.sendDataToCarList()
    }
    /**** Price Range Handler */
    handleMaxPriceChange(event){
        this.filters ={...this.filters, "maxPrice":event.target.value}
        this.sendDataToCarList()
    }
    handleCheckBox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, makeType}
            
        }
        const {name, value} = event.target.dataset
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = this.filters[name].concat(value)
             }  
            
        }
        else{
            this.filters[name] = this.filters[name].filter(item=>item !== value)
            //to remove the value
        }
        this.sendDataToCarList()
    }

    
}