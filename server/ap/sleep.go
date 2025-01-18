package ap

import (
	"fmt"
	"math/rand"
	"time"
)

func Sleep(min, m int) {
	d := randSleep(min, m)
	fmt.Println("sleep:           ", d, " seconds")
	time.Sleep(time.Duration(d) * time.Second)
}

func randSleep(min, max int) int {
	rand.Seed(time.Now().UnixNano())

	return rand.Intn(max-min+1) + min
}
