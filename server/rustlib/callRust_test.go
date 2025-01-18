package rustlib

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestCallRustDemo(t *testing.T) {
	t1 := time.Now()
	input := "https://www.strathweb.com"
	output := CallRustDemo(input)

	input1 := "hello " + input + "!"
	assert.Equal(t, input1, output)

	fmt.Println("time used: ", time.Since(t1))
}

func TestDecryptString(t *testing.T) {
	t1 := time.Now()
	input := "https://www.strathweb.com"
	output, err := EncryptString(input)
	assert.NoError(t, err)
	if err == nil {
		output2, er1 := DecryptString(output)
		assert.NoError(t, er1)
		assert.Equal(t, input, output2)

	}
	fmt.Println("time used: ", time.Since(t1))
}

func BenchmarkSort(b *testing.B) {
	input := "https://www.strathweb.com"
	b.ResetTimer()
	b.StopTimer()
	b.StartTimer()
	for i := 0; i < b.N; i++ {
		output, _ := EncryptString(input)
		output2, _ := DecryptString(output)
		assert.Equal(b, input, output2)

	}
}

func BenchmarkDecryptString(b *testing.B) {
	b.ReportAllocs()
	input := "https://www.strathweb.com"
	output, _ := EncryptString(input)
	b.SetParallelism(24)
	b.ReportAllocs()
	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			output2, _ := DecryptString(output)
			assert.Equal(b, input, output2)
		}
	})
}
