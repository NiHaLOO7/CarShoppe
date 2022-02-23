import { LightningElement, api } from 'lwc';
import PLACE_HOLDER from '@salesforce/resourceUrl/placeholder'
export default class PlaceHolder extends LightningElement {
    @api message
    placeholderUrl = PLACE_HOLDER
}