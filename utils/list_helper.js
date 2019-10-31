var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}


const totallikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    sum = blogs.reduce(reducer, 0)

    return sum
}

const favoriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        return blog.likes > max ? blog.likes : max
    }
    maxlikes = blogs.reduce(reducer, 0)
    var result = blogs.filter(obj => {
        return obj.likes === maxlikes
    })
    if (result[0]) {
        return result[0]
    }
    else {
        return 0
    }

}
const bestAuthor = (blogs) => {
    const counts = {}
    let max_count = ["", 0]
    authors = blogs.map(authors => {
        if (counts[authors.author]) {
            counts[authors.author] += 1
            if (counts[authors.author] > max_count[1]) {
                max_count = [authors.author, counts[authors.author]]
            }
        }
        else {
            counts[authors.author] = 1
        }
    })

    //test = _.countBy(authors)
    //console.log(max_count)

    const result = {
        name: max_count[0],
        blogs: max_count[1]
    }

    return result
}

const favouriteAuthor = (blogs) => {
    const counts = {}
    let max_favs = ["", 0]
    authors = blogs.map(authors => {
        if (counts[authors.author]) {
            counts[authors.author] += authors.likes
            if (counts[authors.author] > max_favs[1]) {
                max_favs = [authors.author, counts[authors.author]]
            }
        }
        else {
            counts[authors.author] = authors.likes
        }
    })

    //test = _.countBy(authors)

    const result = {
        name: max_favs[0],
        likes: max_favs[1]
    }

    console.log(result)
    return result
}

module.exports = {
    dummy,
    totallikes,
    favoriteBlog,
    bestAuthor,
    favouriteAuthor
}