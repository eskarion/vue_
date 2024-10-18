import { defineStore } from "pinia";
import { apiUrl, key } from "@/api";

const requestHeader = {
    'x-api-key': key, 
    Accept: '*/*',
    'User-Agent': 'Vue App'
}

export const useCostStore = defineStore('costStore', {
    state: () => ({
        costs: []
    }), 
    actions: {
        async newCostEntry(projectId) {
            requestHeader['Content-Tyoe'] = 'application/x-www-form-urlencoded'
            const url = apiUrl + 'project/' + projectId            
            try {
                const response = await fetch(url, {                    
                    headers: requestHeader                   
                }) 
                const data = await response.json()
            
                console.log(data)
            } catch (error) {
                console.log(error)
            }
            
        }, 
        async updateCostEntry(costItem) {
            console.log("costItem in costsStore: ", costItem)
            const encodedParams = new URLSearchParams()            
            encodedParams.set('costID', costItem._id)
            encodedParams.set('newDate', costItem.date)
            encodedParams.set('actualCurrencyToShow', costItem.actualCurrencyToShow)
            encodedParams.set('actualAmountToShow', costItem.originalAmount)
            encodedParams.set('billers', costItem.billers)
            encodedParams.set('category', costItem.category)
            encodedParams.set('entryTitle', costItem.entryTitle)
            encodedParams.set('entryInfo', costItem.entryInfo)            
            requestHeader['Content-Tyoe'] = 'application/x-www-form-urlencoded'
            
            const url = apiUrl + '/costs/' + costItem._id
            console.log("encodedParams: ",new URLSearchParams(encodedParams))
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: requestHeader, 
                    body: new URLSearchParams(encodedParams)
                }) 
                const data = await response.json()
                console.log(data)
            } catch (error) {
                console.log(error)
            }            
        }
    }   
})

