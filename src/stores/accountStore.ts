import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from '@/types/account'

export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  const addAccount = (account: Account) => {
    accounts.value.push(account)
  }

  const updateAccount = (id: string, updatedAccount: Partial<Account>) => {
    const index = accounts.value.findIndex((acc) => acc.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updatedAccount }
    }
  }

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  }
}, {
  persist: true,
})
