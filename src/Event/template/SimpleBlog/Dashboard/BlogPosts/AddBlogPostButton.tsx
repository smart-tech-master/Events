import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {v4 as uid} from 'uuid'
import React from 'react'
import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import {now} from 'lib/date-time'
import {useDispatch} from 'react-redux'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import Button from '@material-ui/core/Button'

export default function AddBlogPostButton(props: {className?: string}) {
  const {blogPosts} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const dispatch = useDispatch()

  const addPost = () => {
    const id = uid()
    const post: BlogPost = {
      title: 'My Post',
      postedAt: now(),
      content: '',
    }

    const entities = {
      ...blogPosts.entities,
      [id]: post,
    }
    const ids = [id, ...blogPosts.ids]

    updateTemplate({
      blogPosts: {
        entities,
        ids,
      },
    })

    dispatch(setConfig({type: BLOG_POST, id}))
  }

  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      aria-label="add blog post"
      onClick={addPost}
    >
      Add Blog post
    </Button>
  )
}
