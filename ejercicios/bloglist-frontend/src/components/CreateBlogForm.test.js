import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateBlogForm from './CreateBlogForm'


describe('<CreateBlogForm />', () => {
    test('the component calls the event handler it received as props with the right details when a new blog is created', ()=> {
        const createBlog = jest.fn()
        const component = render(
            <CreateBlogForm createBlog={createBlog}/>
        )
        const form = component.container.querySelector('form')
        const title = component.container.querySelector('#title')
        const url = component.container.querySelector('#url')
        fireEvent.change(title, {
            target: {value: 'prueba'}
        })
        fireEvent.change(url, {
            target: {value: 'http://localhost:3000'}
        })
        fireEvent.submit(form)
        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].title).toBe('prueba')
        expect(createBlog.mock.calls[0][0].url).toBe('http://localhost:3000')
    })

})