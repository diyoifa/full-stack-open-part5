import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'


describe('<Blog />', () => {
    let component = null
    const blog = {
        title:"prueba",
        author:'gregorio',
        likes: 20,
        url: 'httpp://localhost:3000'
    }
    beforeEach(()=>{
        component = render(
            <Blog blog={blog}/>
        )
    })

    test('the component shows title and author by dafault ', ()=>{
        const element = component.getByText(
            'prueba gregorio'
          )
          expect(element).toBeDefined()
    })

    test('when click view display url and likes', ()=>{
        const buttom = component.getByText('view')
        fireEvent.click(buttom)
        const div = component.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display:none')
    })
    test('when click like twice, the event handler is called twice', ()=>{
        const buttom = component.getByText('view')
        fireEvent.click(buttom)
        const like = component.getByText('like')
        fireEvent.click(like)
        fireEvent.click(like)
        const mockHandler = jest.fn()
        expect(mockHandler.mock.calls).toHaveLength(2)
    })

})
