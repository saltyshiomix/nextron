import sys, time

def square_of_number():
    # time.sleep(3) # Simulate a long running process :), you can comment this line to have RT
    print(int(sys.argv[1]) ** 2)

if __name__ == "__main__":
    square_of_number()
