import { defineStore } from 'pinia'
import { apiUrl, key } from '@/api'

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
    async newCostEntry(costItem) {
      console.log(costItem)
      requestHeader['Content-Tyoe'] = 'application/x-www-form-urlencoded'
      const url = apiUrl + '/project/' + costItem.projectId
      const encodedParams = new URLSearchParams()
      encodedParams.set('id', costItem.projectId)

      encodedParams.set('date', costItem.date)
      encodedParams.set('category', costItem.category)
      encodedParams.set('biller', costItem.billers)
      encodedParams.set('expenseTitle', costItem.entryTitle)
      encodedParams.set('expenseDescription', costItem.entryInfo)
      encodedParams.set('expenseAmount', costItem.originalAmount)
      encodedParams.set('currency', 'EUR')
      encodedParams.set('pretax', false)

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeader,
          body: new URLSearchParams(encodedParams)
        })
        const data = await response
        if (data.status === 204) {
          return 200
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateCostEntry(costItem) {
      console.log('costItem in costsStore: ', costItem)
      const encodedParams = new URLSearchParams()
      encodedParams.set('costID', costItem._id)
      encodedParams.set('newDate', costItem.date)
      encodedParams.set('actualCurrencyToShow', costItem.actualCurrencyToShow)
      encodedParams.set('actualAmountToShow', costItem.actualAmountToShow)
      encodedParams.set('billers', costItem.billers)
      encodedParams.set('category', costItem.category)
      encodedParams.set('entryTitle', costItem.entryTitle)
      encodedParams.set('entryInfo', costItem.entryInfo)
      requestHeader['Content-Tyoe'] = 'application/x-www-form-urlencoded'

      const url = apiUrl + '/costs/' + costItem._id
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: requestHeader,
          body: new URLSearchParams(encodedParams)
        })
        await response
      } catch (error) {
        console.log(error)
      }
    },
    async deleteCostEntry(costId, projectId) {
      console.log(`got ${costId} and ${projectId}`)
      const url = apiUrl + '/costs/delete'
      const encodedParams = new URLSearchParams()
      encodedParams.set('costID', costId)
      encodedParams.set('projectID', projectId)

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: requestHeader,
          body: new URLSearchParams(encodedParams)
        })
        await response
      } catch (error) {
        console.log(error)
      }
    }
  }
})
