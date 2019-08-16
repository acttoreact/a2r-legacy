# Linter

## **Already dead**: *First impressions on Linter for Typescript*

Making a quick search, we see that TSLint was the equivalent for ESLint for Typescript, but [it's going to be deprecated]( https://github.com/palantir/tslint/issues/4534) during this same year (I'm writing this on July 2019).

Looks like good news. TSLint will stop accepting features and from Juanary 1st 2019 they will only accept security fixes.

The plan is moving to ESLint, so both Javascript and Typescript are rules will be determined by the same people and share a core (one core to rule them all).

Actually TypeScript itself decided to move from TSLint to ESLint. [Their own experience]((https://github.com/microsoft/TypeScript/issues/30553)) might come in handy.

## **A new friend**: *We need some help*

After this initial search, we come to an [article](https://medium.com/@myylow/how-to-keep-the-airbnb-eslint-config-when-moving-to-typescript-1abb26adb5c6) that we'll be using as our first approach.

## **Stones on the road**: *First questions*

> After installing packages as recommended by the article, we are said to **update** our ```.eslintrc``` file, but what content should already have that file? Any at all? It's not explained so we can't be totally sure.

<details>
<summary>Answer</summary>
Looks like it that's all we needed. We started seeing some Lint warnings and errors after just completing the steps from the article
</details>

> Lint related packages need to be installed as ```dependencies``` or is it enough to install them as ```devDependencies```?

<details>
<summary>Answer</summary>
We just tried with ```devDependencies``` and seems to be working, so that's the answer for now.
</details>

## **Friends on the road**: *Interesting links*

- https://blog.matterhorn.dev/posts/learn-typescript-linting-part-1/

## **Now we are talking**: *Thoughts and moving forward*

Well, as basic as it sound, I forgot to start with the most important: getting Typescript. I just added this point above for good reading reasons, but once I had the ESLint with Typescript plugins theoretically working I realized we were missing Typescript itself.

After our first code fragment to test our Linter we saw that an untyped parameter in a function was only showing up a small warning. According to our basic knowledge of Typescript and the reasons behind our journey, we had no doubt we needed that case to show up like an error.