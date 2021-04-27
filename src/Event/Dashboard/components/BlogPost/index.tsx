import React from 'react'
import styled from 'styled-components'
import {blogPostTime} from 'lib/date-time'

export interface BlogPost {
  title: string
  postedAt: string
  content: string
}

export const BLOG_POST = 'Blog Post'

export function BlogPost(props: {post: BlogPost}) {
  const formattedPost = blogPostTime(props.post.postedAt, 'America/New_York')

  return (
    <Post aria-label="blog post">
      <Title>{props.post.title}</Title>
      <PostDate>{formattedPost}</PostDate>
      <div
        dangerouslySetInnerHTML={{
          __html: props.post.content,
        }}
      />
    </Post>
  )
}

const Post = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Title = styled.h2`
  text-transform: uppercase;
  margin: 0;
  font-size: 30px;
`

const PostDate = styled.span`
  font-size: 14px;
  color: #adadad;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
