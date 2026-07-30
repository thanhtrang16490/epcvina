package storage

import (
	"context"
	"fmt"
	"mime/multipart"
	"path"
	"net/url"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinIO struct {
	client     *minio.Client
	bucket     string
	publicBase string
}

func NewMinIO(endpoint, accessKey, secretKey, bucket, publicBase string) (*MinIO, error) {
	parsed, err := url.Parse(endpoint)
	if err != nil {
		return nil, err
	}

	client, err := minio.New(parsed.Host, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: parsed.Scheme == "https",
	})
	if err != nil {
		return nil, err
	}

	return &MinIO{
		client:     client,
		bucket:     bucket,
		publicBase: strings.TrimRight(publicBase, "/"),
	}, nil
}

func (s *MinIO) EnsureBucket(ctx context.Context) error {
	exists, err := s.client.BucketExists(ctx, s.bucket)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	return s.client.MakeBucket(ctx, s.bucket, minio.MakeBucketOptions{})
}

func (s *MinIO) UploadImage(ctx context.Context, file *multipart.FileHeader, folder string) (string, string, error) {
	src, err := file.Open()
	if err != nil {
		return "", "", err
	}
	defer src.Close()

	name := fmt.Sprintf("%d-%s", time.Now().UnixNano(), file.Filename)
	objectName := path.Join(folder, name)

	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	_, err = s.client.PutObject(ctx, s.bucket, objectName, src, file.Size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", "", err
	}

	return objectName, s.PublicURL(objectName), nil
}

func (s *MinIO) PublicURL(objectName string) string {
	return strings.TrimRight(s.publicBase, "/") + "/" + s.bucket + "/" + strings.TrimLeft(objectName, "/")
}
