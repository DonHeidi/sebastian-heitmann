resource "scaleway_object_bucket" "website" {
  name       = "sebastian-heitmann-website"
  project_id = scaleway_account_project.main.id
}

resource "scaleway_object_bucket_acl" "website" {
  bucket = scaleway_object_bucket.website.id
  acl    = "public-read"
}

resource "scaleway_object_bucket_website_configuration" "website" {
  bucket = scaleway_object_bucket.website.name

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}
