export function getAppoveName(code) {
  if (code === 'SAVE') {
    return '待上报'
  } else if (code === 'START') {
    return '待提交'
  } else if (code === 'SUBMIT') {
    return '审批中'
  } else if (code === 'APPROVED') {
    return '审批通过'
  } else if (code === 'REJECT') {
    return '审批退回'
  } else {
    return ''
  }
}

export function statusList() {
  return [
    { value: 'SAVE', label: '待上报' },
    { value: 'START', label: '待提交' },
    { value: 'SUBMIT', label: '审批中' },
    { value: 'APPROVED', label: '审批通过' },
    { value: 'REJECT', label: '审批退回' }
  ]
}

export function editable(code) {
  return code === 'SAVE' || code === 'REJECT'
}

export function deletable(code) {
  return code === 'SAVE'
}

export function checkable(code) {
  return code === 'SAVE'
}
