import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DangerButton from 'lib/ui/Button/DangerButton'
import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'

export type BlogPostConfig = {
  type: typeof BLOG_POST
  id: string
}
export function BlogPostConfig(props: {id: BlogPostConfig['id']}) {
  const {blogPosts: posts} = useTemplate()

  const {id} = props
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()

  if (!id) {
    throw new Error('Missing post id; was it passed through when calling edit?')
  }

  const post = posts.entities[id]

  const update = <T extends keyof BlogPost>(key: T) => (value: BlogPost[T]) => {
    const updated: BlogPost = {
      ...post,
      [key]: value,
    }

    updateTemplate({
      blogPosts: {
        ...posts,
        entities: {
          ...posts.entities,
          [id]: updated,
        },
      },
    })
  }

  const save = (_: any, editor: any) => update('content')(editor.getData())

  const remove = () => {
    const {[id]: target, ...otherPosts} = posts.entities
    const updatedIds = posts.ids.filter((i) => i !== id)

    closeConfig()
    updateTemplate({
      blogPosts: {
        entities: otherPosts,
        ids: updatedIds,
      },
    })
  }

  return (
    <>
      <EditorContainer>
        <TextField
          value={post.title}
          inputProps={{
            'aria-label': 'blog post title',
          }}
          label="Title"
          fullWidth
          onChange={onChangeStringHandler(update('title'))}
        />
        <CKEditor editor={ClassicEditor} data={post.content} onChange={save} />
        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove blog post"
          onClick={remove}
        >
          DELETE POST
        </RemoveButton>
      </EditorContainer>
    </>
  )
}

// CKEditor has a min-width, anything less will show blank whitespace
// with scroll. So we'll add a container to hide unneeded
// whitespace
const EditorContainer = styled.div`
  overflow-x: hidden;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[5]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
