import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars'

//LMS IMPORT(same for subscriber and publisher just subscribe becomes publish)
import {publish, subscribe, MessageContext} from 'lightning/messageService'
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c'
import CAR_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
export default class CarTileList extends LightningElement {
    cars =[]
    error
    filters = {}
    carFilterSubscription

    /**Load Context For LMS */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }


    @wire(getCars, {filters:'$filters'})
    carHandler({data, error}){
        if(data){
            this.cars = data
        }
        if(error){
            this.error = error
        }
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext, CARS_FILTERED_MESSAGE, (message)=>this.handleFilterChanges(message))
    }
    handleFilterChanges(message){
        this.filters={...message.filters}
        console.log(message.filters)
    }

    dissconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }

    handleCarSelected(event){
        console.log(event.detail)
        publish(this.messageContext, CAR_SELECTED_MESSAGE, {
            carId:event.detail
        })
    }
}