import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export type ColumnType = 'base' | 'text' | 'numeric' | 'formula'

export interface ColumnDef {
  id: string
  label: string
  type: ColumnType
  isCustom: boolean
  formulaConfig?: {
    operand1: string
    operand2: string
    operator: '+' | '*'
  }
}

export interface LineItem {
  id: string
  name: string
  qty: number
  price: number
  customData: Record<string, string | number>
}

export const useInvoiceBuilderStore = defineStore('invoiceBuilder', {
  state: () => ({
    invoiceColumns: [
      { id: 'name', label: 'Item Name', type: 'base', isCustom: false },
      { id: 'qty', label: 'QTY', type: 'base', isCustom: false },
      { id: 'price', label: 'Price', type: 'base', isCustom: false },
      { id: 'rowTotal', label: 'Row Total', type: 'base', isCustom: false }
    ] as ColumnDef[],
    lineItems: [
      { id: uuidv4(), name: '', qty: 1, price: 0, customData: {} }
    ] as LineItem[],
    globalTax: 0,
    globalDiscount: 0,
    discountType: 'flat' as 'flat' | 'percentage'
  }),
  getters: {
    customColumnsCount: (state) => state.invoiceColumns.filter(c => c.isCustom).length,
    numericColumns: (state) => {
      // Returns base numeric and custom numeric columns to be used in formulas
      return state.invoiceColumns.filter(c => 
        ['qty', 'price'].includes(c.id) || c.type === 'numeric'
      )
    },
    computedLineItems: (state) => {
      return state.lineItems.map(item => {
        // Calculate basic row total
        let computedRowTotal = item.qty * item.price

        // Evaluate formula columns
        const formulaCols = state.invoiceColumns.filter(c => c.type === 'formula')
        const calculatedFormulas: Record<string, number> = {}

        formulaCols.forEach(col => {
          if (col.formulaConfig) {
            const getVal = (operandId: string) => {
              if (operandId === 'qty') return item.qty
              if (operandId === 'price') return item.price
              return Number(item.customData[operandId] || 0)
            }
            const val1 = getVal(col.formulaConfig.operand1)
            const val2 = getVal(col.formulaConfig.operand2)
            const result = col.formulaConfig.operator === '*' ? val1 * val2 : val1 + val2
            calculatedFormulas[col.id] = result
          }
        })

        return {
          ...item,
          ...calculatedFormulas,
          rowTotal: computedRowTotal
        }
      })
    },
    subtotal(): number {
      const sum = this.computedLineItems.reduce((acc, item) => acc + item.rowTotal, 0)
      return Number(sum.toFixed(2))
    },
    calculatedDiscount(): number {
      let discount = 0
      if (this.discountType === 'percentage') {
        discount = this.subtotal * (this.globalDiscount / 100)
      } else {
        discount = this.globalDiscount
      }
      return Number(discount.toFixed(2))
    },
    calculatedTax(): number {
      const taxableAmount = this.subtotal - this.calculatedDiscount
      const tax = Math.max(0, taxableAmount) * (this.globalTax / 100)
      return Number(tax.toFixed(2))
    },
    finalTotal(): number {
      const total = Math.max(0, this.subtotal - this.calculatedDiscount + this.calculatedTax)
      return Number(total.toFixed(2))
    }
  },
  actions: {
    addLineItem() {
      this.lineItems.push({
        id: uuidv4(),
        name: '',
        qty: 1,
        price: 0,
        customData: {}
      })
    },
    removeLineItem(index: number) {
      if (this.lineItems.length > 1) {
        this.lineItems.splice(index, 1)
      }
    },
    addColumn(column: ColumnDef, targetId: string) {
      if (this.customColumnsCount >= 2) return

      const targetIndex = this.invoiceColumns.findIndex(c => c.id === targetId)
      if (targetIndex !== -1) {
        this.invoiceColumns.splice(targetIndex, 0, column)
      } else {
        // Fallback to inserting before rowTotal
        const totalIndex = this.invoiceColumns.findIndex(c => c.id === 'rowTotal')
        this.invoiceColumns.splice(totalIndex, 0, column)
      }
    },
    removeColumn(id: string) {
      const index = this.invoiceColumns.findIndex(c => c.id === id)
      if (index !== -1 && this.invoiceColumns[index].isCustom) {
        this.invoiceColumns.splice(index, 1)
        // Cleanup customData from line items
        this.lineItems.forEach(item => {
          delete item.customData[id]
        })
      }
    },
    resetStore() {
      this.invoiceColumns = [
        { id: 'name', label: 'Item Name', type: 'base', isCustom: false },
        { id: 'qty', label: 'QTY', type: 'base', isCustom: false },
        { id: 'price', label: 'Price', type: 'base', isCustom: false },
        { id: 'rowTotal', label: 'Row Total', type: 'base', isCustom: false }
      ]
      this.lineItems = [
        { id: uuidv4(), name: '', qty: 1, price: 0, customData: {} }
      ]
      this.globalTax = 0
      this.globalDiscount = 0
      this.discountType = 'flat'
    }
  }
})
