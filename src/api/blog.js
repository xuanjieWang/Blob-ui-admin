import request from '@/utils/request'

export const addBlog = (data) => {
  return request({
    url: '/blog/data/addBlog',
    method: 'post',
    data: data
  })
}